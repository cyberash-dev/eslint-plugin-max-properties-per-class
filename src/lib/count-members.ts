import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export type Bucket = "method" | "property";

export interface CountFlags {
	includePrivate: boolean;
	includeStatic: boolean;
	includeProtected: boolean;
}

export type Declaration =
	| TSESTree.ClassDeclaration
	| TSESTree.ClassExpression
	| TSESTree.TSInterfaceDeclaration;

type Member =
	| TSESTree.ClassElement
	| TSESTree.TypeElement
	| TSESTree.TSParameterProperty;

interface Classification {
	bucket: Bucket | "ignored";
	key: string | null;
}

const IGNORED: Classification = { bucket: "ignored", key: null };

function hasKey(
	member: Member,
): member is Extract<Member, { key: TSESTree.Node }> {
	return "key" in member && member.key != null;
}

function resolveName(member: Member): string | null {
	if (!hasKey(member)) {
		return null;
	}
	const key = member.key;
	const computed = "computed" in member ? member.computed : false;
	if (computed) {
		return key.type === AST_NODE_TYPES.Literal ? String(key.value) : null;
	}
	if (key.type === AST_NODE_TYPES.Identifier) {
		return key.name;
	}
	if (key.type === AST_NODE_TYPES.PrivateIdentifier) {
		return `#${key.name}`;
	}
	if (key.type === AST_NODE_TYPES.Literal) {
		return String(key.value);
	}
	return null;
}

function collapseKey(member: Member): string | null {
	const name = resolveName(member);
	if (name === null) {
		return null;
	}
	const staticMember = "static" in member && member.static === true;
	return `${staticMember ? "s" : "i"} ${name}`;
}

function classify(member: Member): Classification {
	switch (member.type) {
		case AST_NODE_TYPES.MethodDefinition:
		case AST_NODE_TYPES.TSAbstractMethodDefinition:
			if (member.kind === "constructor") {
				return IGNORED;
			}
			if (member.kind === "get" || member.kind === "set") {
				return { bucket: "property", key: collapseKey(member) };
			}
			return { bucket: "method", key: collapseKey(member) };
		case AST_NODE_TYPES.TSMethodSignature:
			return { bucket: "method", key: collapseKey(member) };
		case AST_NODE_TYPES.TSCallSignatureDeclaration:
			return { bucket: "method", key: " call" };
		case AST_NODE_TYPES.PropertyDefinition:
		case AST_NODE_TYPES.TSAbstractPropertyDefinition: {
			const value = member.value;
			const isFunction =
				value != null &&
				(value.type === AST_NODE_TYPES.ArrowFunctionExpression ||
					value.type === AST_NODE_TYPES.FunctionExpression);
			return { bucket: isFunction ? "method" : "property", key: null };
		}
		case AST_NODE_TYPES.TSPropertySignature: {
			const annotation = member.typeAnnotation?.typeAnnotation;
			const isFunction =
				annotation != null && annotation.type === AST_NODE_TYPES.TSFunctionType;
			return { bucket: isFunction ? "method" : "property", key: null };
		}
		case AST_NODE_TYPES.AccessorProperty:
		case AST_NODE_TYPES.TSAbstractAccessorProperty:
		case AST_NODE_TYPES.TSParameterProperty:
			return { bucket: "property", key: null };
		default:
			return IGNORED;
	}
}

function collectMembers(node: Declaration): Member[] {
	const members: Member[] = [...node.body.body];
	if (
		node.type === AST_NODE_TYPES.ClassDeclaration ||
		node.type === AST_NODE_TYPES.ClassExpression
	) {
		const constructor = node.body.body.find(
			(member): member is TSESTree.MethodDefinition =>
				member.type === AST_NODE_TYPES.MethodDefinition &&
				member.kind === "constructor",
		);
		for (const param of constructor?.value.params ?? []) {
			if (param.type === AST_NODE_TYPES.TSParameterProperty) {
				members.push(param);
			}
		}
	}
	return members;
}

function isStatic(member: Member): boolean {
	return "static" in member && member.static === true;
}

function isPrivate(member: Member): boolean {
	if ("accessibility" in member && member.accessibility === "private") {
		return true;
	}
	return hasKey(member) && member.key.type === AST_NODE_TYPES.PrivateIdentifier;
}

function isProtected(member: Member): boolean {
	return "accessibility" in member && member.accessibility === "protected";
}

function visibilityOf(members: Member[]): "private" | "protected" | "public" {
	if (members.every(isPrivate)) {
		return "private";
	}
	if (members.every((member) => isPrivate(member) || isProtected(member))) {
		return "protected";
	}
	return "public";
}

function isCounted(
	members: Member[],
	bucket: Bucket,
	flags: CountFlags,
): boolean {
	if (members.every(isStatic) && !flags.includeStatic) {
		return false;
	}
	const visibility = visibilityOf(members);
	if (visibility === "private" && !flags.includePrivate) {
		return false;
	}
	if (
		visibility === "protected" &&
		bucket === "method" &&
		!flags.includeProtected
	) {
		return false;
	}
	return true;
}

export function countBucket(
	node: Declaration,
	bucket: Bucket,
	flags: CountFlags,
): number {
	const groups = new Map<string, Member[]>();
	const singles: Member[][] = [];

	for (const member of collectMembers(node)) {
		const classification = classify(member);
		if (classification.bucket !== bucket) {
			continue;
		}
		if (classification.key === null) {
			singles.push([member]);
			continue;
		}
		const group = groups.get(classification.key);
		if (group) {
			group.push(member);
		} else {
			groups.set(classification.key, [member]);
		}
	}

	let count = 0;
	for (const group of [...groups.values(), ...singles]) {
		if (isCounted(group, bucket, flags)) {
			count += 1;
		}
	}
	return count;
}
